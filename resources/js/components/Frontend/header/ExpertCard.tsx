import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

const ExpertCard = ({ expert }) => {
  const image = expert.media[0].original_url;
  const initials = expert.name
    .split(' ')
    .map(name => name[0])
    .join('');
  return (
    <Card className="border-none bg-[rgba(0,0,0,0.4)]">
      <CardContent className="flex h-48 w-full flex-col items-center justify-between gap-4 p-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={image} alt={expert.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="text-xs font-normal text-gray-200">
          <p className="font-semibold">{expert.name}</p>
          <p>{expert.designation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
