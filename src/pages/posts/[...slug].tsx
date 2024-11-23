import { useParams } from "react-router-dom";

const Posts = () => {
  const params = useParams();
  const slugs = params["*"]?.split("/").filter((i) => i);

  console.log(slugs);
  return (
    <div>
      {slugs &&
        slugs.map((slug, index) => (
          <div key={index}>
            <p>Slug: {slug}</p>
          </div>
        ))}
    </div>
  );
};

export default Posts;
