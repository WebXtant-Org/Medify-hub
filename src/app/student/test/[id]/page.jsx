import TakeTest from '@/views/user/TakeTest'

export const metadata = {
  title: 'Take Test | Medify Hub',
  description: 'Online Examination Portal'
}

const Page = async (props) => {
  const params = await props.params
  const { id } = params

  return <TakeTest id={id} />
}

export default Page
