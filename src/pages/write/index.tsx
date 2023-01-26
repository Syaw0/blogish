import Write from "../../components/pageComponents/write/write";
import Head from "next/head";
import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { Provider } from "react-redux";
import makeStore from "../../store/write/writeStore";
import getPost from "../../../db/util/getPost";
import getPostContent from "../../../db/util/getPostContent";
import checkSession from "../../../server/util/checkSession";

const WritePage = ({ ...params }: WritePagePropsType) => {
  return (
    <>
      <Head>
        <title>Write a Article</title>
        <meta name="description" content="blogish Write Page" />
      </Head>

      <Provider store={makeStore(params)}>
        <Write {...params} />
      </Provider>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}): Promise<GetServerSidePropsResult<WritePagePropsType>> => {
  const props = {
    isLogin: false,
    profileData: {
      name: "",
      profileUrl: "",
      id: "",
    },
  };
  const isLogged = await checkSession(req.cookies);
  if (isLogged.status) {
    props.isLogin = true;
    props.profileData = isLogged.data;
  } else {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  let post: any;
  if (query && query.edit && query.id != null) {
    post = await getPost(query.id);
    if (!post.status) {
      return { redirect: { destination: "/404", permanent: false } };
    }
    let postDetail = await getPostContent(query.id);
    console.log(postDetail);
    if (postDetail.status) {
      post.data.postDetail = postDetail.data;
    }
  }
  if (post == null) {
    post = { data: {} };
    post.data.postDetail = "";
    post.data.postHead = "";
    post.data.postSubhead = "";
    post.data.id = null;
  }

  return {
    props: {
      ...props,
      isEdit: query && query.edit == "true",
      postDetail: post.data.postDetail,
      postHead: post.data.postHead,
      postSubhead: post.data.postSubhead,
      id: post.data.id,
    },
  };
};

export default WritePage;
