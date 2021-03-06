import * as React from 'react';
import { useRecoilState } from 'recoil';
import state from 'src/recoil';
import { usePost } from 'src/hooks';

const Post = () => {
  const [uname, setUname] = useRecoilState(state.uname);
  const [message, setMessage] = useRecoilState(state.message);

  const { post, uploadImage } = usePost();

  return React.useMemo(() => {
    const postMesseage = (
      keyEvent: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      const submitButton = document.getElementById("submit")
        ? document.getElementById("submit")
        : null;
      if (submitButton && message && keyEvent.key === "Enter") {
        submitButton.click();
        setMessage("");
      }
    };
    return (
      <>
        <label>
          <span className="btn btn-info">
            画像アップロード
            <input
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={e => uploadImage(e)}
            />
          </span>
        </label>

        <hr />

        <form onSubmit={e => post(e)}>
          <div className="form-group text-center">
            <input
              required
              maxLength={15}
              placeholder="ハンネ"
              size={30}
              value={uname}
              onChange={e => setUname(e.target.value)}
            />
          </div>

          <div className="form-group">
            <textarea
              style={{ maxWidth: 400, margin: '0 auto' }}
              className="form-control"
              id="textarea"
              placeholder="メッセージ 150文字以内"
              required
              maxLength={150}
              value={message}
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => postMesseage(e)}></textarea>

            <div className="text-center">
              <input
                type="submit"
                value="投稿"
                className="btn btn-primary"
                id="submit"
              />
            </div>
          </div>
        </form>

        <hr />
      </>
    );
  }, [uname, message, uploadImage, post, setUname, setMessage]);
};

export default Post;
