import { CallRoom } from '@/components/CallRoom'

export default function RoomPage({ params }: { params: { id: string } }) {
  return <CallRoom roomId={params.id} />
}

export const dynamic = 'force-dynamic'
