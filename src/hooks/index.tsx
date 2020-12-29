import * as React from 'react';
import * as _ from 'lodash';
import { useRecoilState } from 'recoil';

import state from 'src/recoil';
import firebase from 'src/firebase';
import constant from 'src/constants';
import { pushNotification } from 'src/util';

const ifvisible = require('ifvisible.js');

// Twitter
export const useTwitter = () => {
  const login = () => {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  };

  const logout = () => {
    firebase.database().goOffline();
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  return { login, logout };
};

// 画面監視
export const useDisplay = () => {
  const [active, setActive] = React.useState(true);
  const [init, setInit] = React.useState(false);

  ifvisible.on('focus', async () => {
    setActive(true);
  });

  ifvisible.on('blur', async () => {
    setActive(false);

    // 切断
    firebase.database().goOffline();
  });

  React.useMemo(() => {
    if (active && init) {
      // 再接続処理
      firebase.database().goOnline();
    }

    if (!init) {
      setInit(true);
    }
  }, [active, init]);

  return {};
};

// 投稿
export const usePost = () => {
  const [uid] = useRecoilState(state.uid);
  const [uname] = useRecoilState(state.uname);
  const [message, setMessage] = useRecoilState(state.message);
  const [, setLoading] = useRecoilState(state.loading);

  // 画像アップロード
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return;
    }

    setLoading(true);

    const _s = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const _fileName =
      [...Array(10)]
        .map(() => _s[Math.floor(Math.random() * _s.length)])
        .join('') + new Date().getTime();

    const _storageRef = firebase.storage().ref().child(_fileName);

    // 画像保存
    _storageRef.put(e.target.files[0]).then(() => {
      _storageRef
        .getDownloadURL()
        .then(async (url: string) => {
          // データ保存
          await firebase.database().ref(constant.table.boards).push({
            uid: uid,
            uname: uname,
            message: url,
            image: true,
            createdAt: new Date().getTime(),
            updatedAt: new Date().getTime(),
          });

          setLoading(false);
        })
        .catch(() => {
          alert('画像のサイズは5MBまでです。');
          location.reload();
        });
    });
  };

  const post = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!(e.target as HTMLInputElement).checkValidity()) {
      return;
    }

    e.preventDefault();

    const _message = message;
    setMessage('');
    document.getElementById('textarea')?.blur();

    await firebase.database().ref(constant.table.boards).push({
      uid: uid,
      uname: uname,
      message: _message.trim(),
      image: false,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    document.getElementById('textarea')?.focus();

    // lineに通知
    pushNotification(`${uid}\n\n${message}`);
  };

  return { post, uploadImage };
};

// 初期化
export const useInit = () => {
  const [, setUid] = useRecoilState(state.uid);
  const [, setList] = useRecoilState(state.list);
  const [, setSu] = useRecoilState(state.su);
  const [, setLoading] = useRecoilState(state.loading);
  const [, setSnsLogin] = useRecoilState(state.snsLogin);

  const _connectionMonitoring = React.useCallback(async () => {
    const presenceRef = firebase.database().ref('/.info/connected');
    const uid = (await firebase.auth().currentUser?.uid) as string;
    const listRef = firebase
      .database()
      .ref(constant.table.connections + '/' + uid);
    const userRef = listRef.push();

    presenceRef.on('value', async snap => {
      if (snap.val()) {
        userRef.onDisconnect().remove();
        userRef.set(uid);
      }
    });

    firebase
      .database()
      .ref('connections')
      .on('value', s => {
        setSu(s.numChildren());
      });
  }, [setSu]);

  const _list = React.useCallback(() => {
    firebase
      .database()
      .ref(constant.table.boards)
      .orderByChild('createdAt')
      .limitToLast(50)
      .on('value', snapshot => {
        let _data: any[] = [];
        snapshot.forEach(childSnapshot => {
          _data.push(childSnapshot.val());
        });

        setList(_.orderBy(_data, 'createdAt', 'desc'));
        setLoading(false);

        _connectionMonitoring();
      });
  }, [setList, setLoading, _connectionMonitoring]);

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async data => {
      if (data === null) {
        // 匿名ログイン
        await firebase.auth().signInAnonymously();
        return;
      }

      if (data.providerData.length !== 0) {
        setSnsLogin(true);
      }

      // lineに通知
      pushNotification((await firebase.auth().currentUser?.uid) as string);

      _list();
      setUid((await firebase.auth().currentUser?.uid) as string);
    });
  }, [_list, setSnsLogin, setUid]);

  return {};
};
