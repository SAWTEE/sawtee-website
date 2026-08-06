import type { Team } from '@/types';

type TeamMemberProps = {
  member?: Team | null;
};

const TeamMember = ({ member = null }: TeamMemberProps) => {
  return member?.name ?? null;
};

export default TeamMember;
