import styled from "styled-components";
import { Header, Table } from "./components";
import { useEffect } from "react";

interface AppContainerProps {
    className?: string;
}

const LIST_NAME = "A";

function sendNotification(tasksCount: number) {
    if (Notification.permission === "granted") {
        new Notification("Внимание!", {
            body: `В красном листе ${tasksCount} задач(а)!`,
            icon: "/icon.png",
            requireInteraction: true,
        });
        console.log("Пуш отправлен");
    } else {
        console.log("Нет разрешения на уведомления");
    }
}

const AppContainer = ({ className }: AppContainerProps) => {
    useEffect(() => {
        console.log("Текущий статус уведомлений:", Notification.permission);

        if (Notification.permission === "default") {
            Notification.requestPermission().then((perm) => {
                console.log("Разрешение получено:", perm);
                if (perm === "granted") {
                    checkTasksAndNotify();
                }
            });
        } else if (Notification.permission === "granted") {
            checkTasksAndNotify();
        } else {
            console.log("Уведомления запрещены");
        }
    }, []);

    function checkTasksAndNotify() {
        const stored = localStorage.getItem("tasks");
        console.log("Данные из localStorage:", stored);

        if (!stored) return console.log("tasks не найден в localStorage");

        try {
            const tasks = JSON.parse(stored);
            if (!Array.isArray(tasks)) {
                console.log("tasks не массив");
                return;
            }

            const redTasks = tasks.filter((t: any) => t.list === LIST_NAME);
            console.log(`Задач в листе ${LIST_NAME}:`, redTasks.length);

            if (redTasks.length > 0) {
                sendNotification(redTasks.length);
            }
        } catch (e) {
            console.error("Ошибка парсинга tasks", e);
        }
    }

    return (
        <div className={className}>
            <Header />
            <Table />
        </div>
    );
};

export const App = styled(AppContainer)`
    display: flex;
    justify-content: center;
    margin: 0 auto;
    max-width: 1000px;
    width: 100%;
`;
