import * as React from 'react';
import { useRecoilState } from 'recoil';

import { useTwitter } from 'src/hooks';
import state from 'src/recoil';
import constant from 'src/constants';

const Header = () => {
  const [snsLogin] = useRecoilState(state.snsLogin);
  const [su] = useRecoilState(state.su);
  const { login, logout } = useTwitter();

  return React.useMemo(() => {
    return (
      <>
        <div className="row">
          <div className="col-12 clearfix">
            <div className="float-left">
              <h1 style={{ fontSize: 20 }}>{constant.title}</h1>
            </div>

            <div className="float-right">
              {snsLogin === false ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={async () => login()}
                >
                  ログイン
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => logout()}
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>
        </div>

        <p>接続ユーザ数: {su}</p>
        <hr />
      </>
    );
  }, [su, login, logout, snsLogin]);
};

export default Header;
