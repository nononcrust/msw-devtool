import { usePostList } from '../services';

export const PostList = () => {
  const { data: posts } = usePostList();

  if (posts.length === 0) {
    return <span>게시글이 없습니다.</span>;
  }

  return (
    <ul data-testid="post-list">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};
