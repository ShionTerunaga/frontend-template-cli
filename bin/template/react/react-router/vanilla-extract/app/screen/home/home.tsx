import { Link } from 'react-router'
import { Box, Heading } from '@/components/ui'
import { ja } from '@/shared/lang/ja'

export default function HomeView() {
    return (
        <Box as="main">
            <Heading>{ja.app.home.title}</Heading>
            <Link to="/server-loader">{ja.app.home.toServerLoaderPotter}</Link>
            <br />
            <Link to="/client-loader">{ja.app.home.toClientLoaderPotter}</Link>
            <br />
            <Link to="/server-action">{ja.app.home.toServerActionPotter}</Link>
        </Box>
    )
}
