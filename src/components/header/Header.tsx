import styled from "styled-components"
import { Icon } from "../icon/icon"
import { getScreenWidth } from "../../utils/getScreenWidth"

interface HeaderContainerProps {
    className?: string
}

const HeaderContainer = ({ className }: HeaderContainerProps) => {
    return (
        <div className={className}>
            <div className="header-container">
                <img
                    className="logo-img"
                    src={`/images/${
                        getScreenWidth(770) ? "Logo.png" : "Logo-mobile.png"
                    }`}
                    alt="logo"
                />
                <div className="btn-container">
                    <div>К тренировкам</div>
                    <Icon name="biceps.svg" inactive />
                </div>
            </div>
        </div>
    )
}

export const Header = styled(HeaderContainer)`
    position: fixed;
    top: 0;
    background-color: #222222;
    width: 100%;
    display: flex;
    justify-content: center;
    height: 80px;
    box-shadow: 0 0 10px 5px #141414;
    z-index: 5;

    .btn-container {
        display: flex;
        gap: 10px;
        align-items: center;
        border: 2px solid #393939;
        border-radius: 10px;
        padding: 5px 20px;
        transition: opacity 0.2s, background-color 0.2s;

        &:hover {
            background-color: #393939;
            cursor: pointer;
            border: 2px solid #646464;
        }
        &:active {
            background-color: #646464;
        }
    }

    .header-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        max-width: 1000px;
        width: 100%;
        padding: 0 20px;
    }
    .header-title {
        font-weight: 400;
        font-size: 25px;
        text-align: right;
        display: flex;
        gap: 10px;
        box-shadow: 0 0 5px 1px #3eb942;
        background-color: #393939;
        padding: 10px 30px;
        border-left: 4px solid #393939;
        border-top: 1px solid #393939;
        border-bottom: 1px solid #393939;
        border-right: 4px solid #393939;
        border-bottom-left-radius: 60px 60px;
        border-top-right-radius: 60px 60px;
    }
    .logo-img {
        height: 100%;
    }
`
