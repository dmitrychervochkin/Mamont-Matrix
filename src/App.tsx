import styled from "styled-components"
import { Header, Table } from "./components"

interface AppContainerProps {
    className?: string
}

const AppContainer = ({ className }: AppContainerProps) => {
    return (
        <div className={className}>
            <Header />
            <Table />
        </div>
    )
}

export const App = styled(AppContainer)`
    display: flex;
    // align-items: center;
    justify-content: center;
    margin: 0 auto;
    max-width: 1000px;
    width: 100%;
`
