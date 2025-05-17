import styled, { css } from "styled-components"

interface IconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
    name: string;
    variant?: keyof typeof iconVariants;
    size?: keyof typeof iconSizes;
    disabled?: boolean;
    inactive?: boolean;
}

export const Icon: React.FC<IconProps> = ({ className, name, ...props }) => {
    return (
        <StyledIcon
            className={className}
            data-icon={"icons/" + name}
        >
            <StyledImg
                className={"icon"}
                src={"/icons/" + name}
                alt="icon"
                {...props}
            />
        </StyledIcon>
    )
}

const iconVariants = {
    primary: css`
        opacity: 0.8;

        &:hover {
            opacity: 1;
        }
    `,
    menu: css`
        opacity: 0.4;

        &:hover {
            opacity: 0.8;
        }
    `,
    current: css`
        opacity: 1;

        &:hover {
            opacity: 0.8;
        }
    `,
}

const iconSizes = {
    verySmall: css`
        height: 15px;
    `,
    small: css`
        height: 25px;
    `,
    medium: css`
        height: 30px;
    `,
    large: css`
        height: 35px;
    `,
    xlarge: css`
        height: 40px;
    `,
}

const StyledIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

interface StyledImgProps {
    variant?: keyof typeof iconVariants;
    size?: keyof typeof iconSizes;
    disabled?: boolean;
    inactive?: boolean;
}

const StyledImg = styled.img<StyledImgProps>`
    transition: opacity 0.3s;

    &:hover {
        cursor: pointer;
    }
    ${({ variant = "primary" }) => iconVariants[variant]};
    ${({ size = "medium" }) => iconSizes[size]};
    ${({ disabled = false }) =>
        disabled &&
        css`
            opacity: 0.4;
            &:hover {
                opacity: 0.4;
                cursor: not-allowed;
            }
        `};
    ${({ inactive = false }) =>
        inactive &&
        css`
            opacity: 1;
            &:hover {
                cursor: default;
                opacity: 1;
            }
        `};
`
