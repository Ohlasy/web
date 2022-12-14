import { Banner } from "src/data-source/banners";
import { getUserAvatar, LatestTopicsSummary } from "src/data-source/forum";
import { Route } from "src/routing";
import { BannerBox } from "./BannerBox";

export type Props = {
  latestForumSummary: LatestTopicsSummary;
  banner: Banner;
};

export const ForumOverviewBox = ({ latestForumSummary, banner }: Props) => {
  const { topic_list, users } = latestForumSummary;

  const topics = topic_list.topics
    // Topic #8 is an old welcome post, not sure why it’s always there
    .filter((topic) => topic.id !== 8)
    .slice(0, 10);

  const getAvatarForUserId = (id: number) => {
    const user = users.find((u) => u.id === id)!;
    return getUserAvatar(user, 50);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-8 forum-topic-list">
          {topics.map((topic) => (
            <div key={topic.id} className="row">
              <div className="col-sm-8">
                <a href={Route.toForumTopic(topic)}>{topic.title}</a>
              </div>
              <div className="col-sm-4">
                {topic.posters.map(({ user_id }) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={user_id}
                    src={getAvatarForUserId(user_id)}
                    className="discourse-avatar"
                    alt=""
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4 hidden-md hidden-sm hidden-xs">
          <div className="box">
            <BannerBox banner={banner} />
          </div>
        </div>
      </div>
    </>
  );
};
