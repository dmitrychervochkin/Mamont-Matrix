import styled from "styled-components";
import { getScreenWidth } from "../../../../utils/getScreenWidth";

interface Task {
    id: string | number;
    title: string;
    completed: boolean;
    list: string;
}

type TableCardContainerProps = {
    color: string;
    className?: string;
    tasks?: Task[];
    setTasks?: (tasks: Task[]) => void;
    list: string;
    setWaitingTasks?: (tasks: Task[]) => void;
};

const TableCardContainer = ({
    className,
    tasks,
    setTasks,
    list,
    setWaitingTasks,
}: TableCardContainerProps) => {
    const onCompletedClicked = (id: string | number) => {
        const updatedList = tasks?.map((item) => {
            if (item.id === id) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
        if (setTasks && updatedList) {
            setTasks(updatedList);
        }
        localStorage.setItem("tasks", JSON.stringify(updatedList));
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData("text/plain");
        const taskTitle = e.dataTransfer.getData("text/title");

        if (!taskId || !taskTitle) return;

        const newTask = {
            id: taskId,
            title: taskTitle,
            completed: false,
            list,
        };

        const prevTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const updatedTasks = [
            ...prevTasks.filter((t: Task) => t.id.toString() !== taskId),
            newTask,
        ];
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks?.(updatedTasks);

        const waiting = JSON.parse(
            localStorage.getItem("waiting_tasks") || "[]"
        );
        const updatedWaiting = waiting.filter(
            (t: Task) => t.id.toString() !== taskId
        );
        localStorage.setItem("waiting_tasks", JSON.stringify(updatedWaiting));
        setWaitingTasks?.(updatedWaiting);
    };

    return (
        <div
            className={className}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{
                padding: getScreenWidth(770) ? "10px 15px" : "5px 5px",
                borderRadius: getScreenWidth(770) ? "20px" : "10px",
            }}
        >
            <div className="tasks-list">
                {tasks?.map(
                    ({ id, title, completed, list: listItem }) =>
                        listItem === list && (
                            <div
                                draggable={true}
                                className="task-item task"
                                key={id}
                                onDragStart={(e) => {
                                    e.dataTransfer.setData(
                                        "text/plain",
                                        id.toString()
                                    );
                                    e.dataTransfer.setData("text/title", title);
                                }}
                                style={{
                                    textDecoration: completed
                                        ? "line-through"
                                        : "none",
                                    color: completed ? "#a2a2a2" : "#393939",
                                    padding: getScreenWidth(770)
                                        ? "8px 12px"
                                        : "3px 7px",
                                    border: getScreenWidth(770)
                                        ? "2px solid #393939"
                                        : "1px solid #393939",
                                    borderRadius: getScreenWidth(770)
                                        ? "10px"
                                        : "5px",
                                    fontSize: getScreenWidth(770)
                                        ? "15px"
                                        : "12px",
                                }}
                                onClick={() => onCompletedClicked(id)}
                            >
                                {title}
                            </div>
                        )
                )}
                {tasks?.length === 0 && (
                    <div className="zero-tasks-length">Список задач пуст!</div>
                )}
            </div>
        </div>
    );
};
export const TableCard = styled(TableCardContainer)`
    min-height: clamp(150px, 20vh, 400px);
    background-color: ${({ color }) => color};
    word-wrap: break-word;
    overflow: hidden;

    .tasks-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        width: 100%;
    }
    .task-item {
        transition: opacity 0.2s;
        word-break: break-word;
        white-space: normal;
        max-width: 100%;
        background-color: transparent;

        &:hover {
            cursor: pointer;
            opacity: 0.5;
        }
    }
`;
