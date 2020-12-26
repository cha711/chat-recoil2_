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
  const [uid] = useRecoilState(state.uid);
  const [, setLoading] = useRecoilState(state.loading);
  const [, setPopUp] = useRecoilState(state.popUp);

  const login = () => {
    // ローディング画面にする
    setLoading(true);

    setPopUp(true);

    // delete connections
    firebase.database().ref(constant.table.connections).child(uid).remove();

    const provider = new firebase.auth.TwitterAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        window.location.reload();
      })
      .catch(e => window.location.reload());
  };

  const logout = () => {
    firebase.database().goOffline();
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.reload();
      })
      .catch(error => {});
  };

  return { login, logout };
};

// 画面監視
export const useDisplay = () => {
  const [popUp] = useRecoilState(state.popUp);
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
    if (active && init && !popUp) {
      // 再接続処理
      firebase.database().goOnline();
    }

    if (!init) {
      setInit(true);
    }
  }, [active, init, popUp]);

  return {};
};

// 投稿
export const usePost = () => {
  const [uid] = useRecoilState(state.uid);
  const [uname] = useRecoilState(state.uname);
  const [message, setMessage] = useRecoilState(state.message);

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
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    });

    document.getElementById('textarea')?.focus();

    // lineに通知
    pushNotification(`${uid}\n\n${message}`);
  };

  return { post };
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
