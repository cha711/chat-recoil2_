import * as React from 'react';
import { useRecoilState } from 'recoil';

import state from 'src/recoil';

import moment from 'moment';
moment.locale('ja');
const reactStringReplace = require('react-string-replace');

const List = () => {
  const [uid] = useRecoilState(state.uid);
  const [list] = useRecoilState(state.list);

  return React.useMemo(() => {
    const html = list.map((m, i) => {
      if (m.uid === uid) {
        // 左吹き出し
        return (
          <div key={i}>
            <div className="clearfix">
              <div className="float-right">
                <div style={{ fontSize: 12, color: '#fff' }}>
                  {m.uname === undefined ? '名無し' : m.uname}
                </div>
                <div style={{ fontSize: 12, color: '#fff' }}>{m.uid}</div>
              </div>
            </div>

            <div className="clearfix">
              <div className="balloon2 float-right">
                {reactStringReplace(
                  m.message,
                  /(https?:\/\/\S+)/g,
                  (match: string, j: number) => (
                    <a
                      href={match}
                      key={match + j}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {match}
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="clearfix">
              <div className="float-right">
                <time style={{ fontSize: 12 }}>
                  {moment(new Date(m.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
                </time>
              </div>
            </div>
            <br />
          </div>
        );
      }

      // 右吹き出し
      return (
        <div key={i}>
          <div style={{ fontSize: 12, color: '#fff' }}>
            {m.uname === undefined ? '名無し' : m.uname}
          </div>

          <div style={{ fontSize: 12, color: '#fff' }}>{m.uid}</div>
          <div className="clearfix">
            <div className="balloon1 float-left">
              {reactStringReplace(
                m.message,
                /(https?:\/\/\S+)/g,
                (match: string, j: number) => (
                  <a
                    href={match}
                    key={match + j}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {match}
                  </a>
                )
              )}
            </div>
          </div>
          <div className="clearfix">
            <div>
              <time style={{ fontSize: 12 }}>
                {moment(new Date(m.createdAt)).format('YYYY-MM-DD HH:mm:ss')}
              </time>
            </div>
          </div>
          <br />
        </div>
      );
    });

    return <div className="line-bc">{html}</div>;
  }, [list, uid]);
};

export default List;
