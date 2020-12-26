import * as React from 'react';
import { useRecoilState } from 'recoil';

import state from 'src/recoil';
import { useDisplay, useInit } from 'src/hooks';

import Loading from 'src/components/loading';
import Header from 'src/components/header';
import Post from 'src/components/section/post';
import List from 'src/components/section/list';
import Sidebar from 'src/components/sidebar';
import Footer from 'src/components/footer';

const App = () => {
  const [loading] = useRecoilState(state.loading);

  useInit();
  useDisplay();

  if (loading) {
    return <Loading />;
  }

  return (
    <div id="_wrap">
      <header>
        <Header />
      </header>

      <main>
        <div className="row">
          <article className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9">
            <section>
              <Post />
              <List />
            </section>
          </article>
          <aside className="col-xs-0 col-sm-0 col-md-0 col-lg-3 col-xl-3">
            <Sidebar />
          </aside>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default App;
