import styled from "styled-components";
import { getScreenWidth } from "../../utils/getScreenWidth";
import { TableCard } from "./components";
import { useEffect, useState } from "react";
import { Icon } from "../icon/icon";

interface TableContainerProps {
    className?: string;
}

interface Task {
    id: string | number;
    title: string;
    completed: boolean;
    list: string;
}

const TableContainer = ({ className }: TableContainerProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [waitingTasks, setWaitingTasks] = useState<Task[]>([]);
    const [isSave, setIsSave] = useState(false);

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        setTasks(storedTasks ? JSON.parse(storedTasks) : []);
        const storedWaitingTasks = localStorage.getItem("waiting_tasks");
        setWaitingTasks(
            storedWaitingTasks ? JSON.parse(storedWaitingTasks) : []
        );
    }, [isSave]);

    const addNewTaskClicked = () => {
        localStorage.setItem(
            "waiting_tasks",
            JSON.stringify([
                ...waitingTasks,
                {
                    id: new Date().getTime(),
                    completed: false,
                    list: "",
                    title: newTask,
                },
            ])
        );
        setIsSave((p) => !p);
        setNewTask("");
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // чтобы позволить drop
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const taskId = e.dataTransfer.getData("text/plain");

        if (!taskId) return;

        const prevTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const updatedTasks = prevTasks.filter(
            (t: Task) => t.id.toString() !== taskId
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        setTasks(updatedTasks);

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
            style={{
                padding: getScreenWidth(770) ? "20px" : "10px",
            }}
        >
            <div
                className="table-container"
                style={{
                    gridTemplateColumns: getScreenWidth(770)
                        ? "50px 1fr 1fr"
                        : "20px 1fr 1fr",
                    gridTemplateRows: getScreenWidth(770)
                        ? "50px auto auto"
                        : "25px auto auto",
                }}
            >
                <div className="empty" onDragOver={onDragOver} onDrop={onDrop}>
                    <Icon
                        id="delete"
                        name="delete.svg"
                        size={getScreenWidth(770) ? "medium" : "small"}
                        inactive
                    />
                </div>
                <div className="table-header">Срочно</div>
                <div className="table-header">Не срочно</div>

                <div className="side-header">Важно</div>
                <TableCard
                    color="#f8b4b4"
                    tasks={tasks}
                    setTasks={setTasks}
                    setWaitingTasks={setWaitingTasks}
                    list="A"
                    // id="col-a"
                    data-column="A"
                />
                <TableCard
                    color="#c6f6d5"
                    tasks={tasks}
                    setTasks={setTasks}
                    setWaitingTasks={setWaitingTasks}
                    list="B"
                    // id="col-b"
                    data-column="B"
                />
                <div className="side-header">Не важно</div>
                <TableCard
                    color="#fefcbf"
                    tasks={tasks}
                    setTasks={setTasks}
                    setWaitingTasks={setWaitingTasks}
                    list="C"
                    // id="col-c"
                    data-column="C"
                />
                <TableCard
                    color="#e2d8d8"
                    tasks={tasks}
                    setTasks={setTasks}
                    setWaitingTasks={setWaitingTasks}
                    list="D"
                    // id="col-d"
                    data-column="D"
                />
            </div>
            <div className="add-task-list">
                <div>Добавить задачу</div>
                <div className="add-task-input-container">
                    <Icon
                        name="save.svg"
                        size="small"
                        onClick={addNewTaskClicked}
                    />
                    <input
                        className="add-task-input"
                        value={newTask}
                        placeholder="Какую задачу вы хотите добавить?"
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </div>
                <div
                    style={{
                        height: waitingTasks.length === 0 ? "40px" : "auto",
                    }}
                    className="waiting-tasks-list"
                    id="all-tasks"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        const taskId = e.dataTransfer.getData("text/plain");
                        const taskTitle = e.dataTransfer.getData("text/title");

                        if (!taskId || !taskTitle) return;

                        const newTask = {
                            id: taskId,
                            title: taskTitle,
                            completed: false,
                            list: "",
                        };

                        // Удаляем из основной таблицы
                        const storedTasks = JSON.parse(
                            localStorage.getItem("tasks") || "[]"
                        );
                        const filteredTasks = storedTasks.filter(
                            (t: Task) => t.id.toString() !== taskId
                        );
                        localStorage.setItem(
                            "tasks",
                            JSON.stringify(filteredTasks)
                        );

                        // Добавляем в ожидание
                        const storedWaiting = JSON.parse(
                            localStorage.getItem("waiting_tasks") || "[]"
                        );
                        const updatedWaiting = [...storedWaiting, newTask];
                        localStorage.setItem(
                            "waiting_tasks",
                            JSON.stringify(updatedWaiting)
                        );

                        // Обновим стейт
                        setIsSave((prev) => !prev); // триггер useEffect
                    }}
                >
                    {waitingTasks.map(({ id, title }) => (
                        <div
                            className="waiting-task task"
                            key={id}
                            draggable="true"
                            onDragStart={(e) => {
                                e.dataTransfer.setData(
                                    "text/plain",
                                    id.toString()
                                );
                                e.dataTransfer.setData("text/title", title);
                            }}
                        >
                            {title}
                        </div>
                    ))}
                    {waitingTasks?.length === 0 && (
                        <div className="zero-tasks-length">
                            Список задач пуст!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Table = styled(TableContainer)`
    margin-top: 90px;
    // height: calc(100vh - 100px);
    max-width: 1000px;
    width: 100%;
    background-color: #222222;
    border-radius: 20px;

    .table-container {
        display: grid;
        grid-template-columns: 50px 1fr 1fr;
        grid-template-rows: 50px auto auto;
        gap: 10px;
        width: 100%;
    }

    .table-container > .cell {
        min-height: clamp(150px, 20vh, 400px);
        border-radius: 20px;
    }

    .a {
        background-color: #f8b4b4;
    }
    .b {
        background-color: #c6f6d5;
    }
    .c {
        background-color: #fefcbf;
    }
    .d {
        background-color: #e2d8d8;
    }

    .table-header {
        color: #a2a2a2;
        font-size: 18px;
        height: auto;
        margin-bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
    .side-header {
        color: #a2a2a2;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        font-size: 18px;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 5px;
    }
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
    .add-task-list {
        background-color: #393939;

        border-radius: 20px;
        margin: 30px 0;
        padding: 20px;
    }
    .add-task-input {
        background-color: #393939;
        border: none;
        border-radius: 0;
        border-bottom: 2px solid #a2a2a2;
        width: 100%;
        height: 30px;
        font-size: 14px;
        outline: none;
        color: #a1a1a1;
    }
    .add-task-input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0 15px 0;
    }
    .waiting-tasks-list {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }
    .waiting-task {
        padding: 8px 12px;
        border: 2px solid #a2a2a2;
        border-radius: 10px;
        word-break: break-word;
        white-space: normal;
        max-width: 100%;

        &:hover {
            background-color: #646464;
            cursor: grabbing;
        }
    }
    .zero-tasks-length {
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: #a2a2a2;
    }
`;
