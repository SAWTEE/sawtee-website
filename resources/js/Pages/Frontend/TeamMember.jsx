const TeamMember = ({ member, ...rest }) => {
  const avatar = member.media.filter(
    media => media.collection_name === 'avatar'
  )[0];
  return member.name;
};

export default TeamMember;
