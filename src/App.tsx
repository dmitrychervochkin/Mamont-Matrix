import styled from "styled-components";
import { Header, Table } from "./components";
import { useEffect } from "react";

interface AppContainerProps {
    className?: string;
}

const LIST_NAME = "A";

interface Task {
    list: string;
    // add other properties if needed
}

const AppContainer = ({ className }: AppContainerProps) => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then(() => {
                    if (Notification.permission === "granted") {
                        checkTasksAndNotify();
                    } else if (Notification.permission === "default") {
                        Notification.requestPermission().then((perm) => {
                            if (perm === "granted") {
                                checkTasksAndNotify();
                            } else {
                                console.log(
                                    "Пользователь отказался от уведомлений"
                                );
                            }
                        });
                    }
                })
                .catch((error) => {
                    console.error(
                        "❌ Ошибка регистрации Service Worker:",
                        error
                    );
                });
        }
    }, []);

    function checkTasksAndNotify() {
        const stored = localStorage.getItem("tasks");

        if (!stored) return console.log("tasks не найден в localStorage");

        try {
            const tasks: Task[] = JSON.parse(stored);
            if (!Array.isArray(tasks)) {
                console.log("tasks не массив");
                return;
            }

            const redTasks = tasks.filter((t: Task) => t.list === LIST_NAME);

            if (redTasks.length === 0) return;

            const lastPush = localStorage.getItem("lastPushTime");
            const now = Date.now();

            if (lastPush && now - parseInt(lastPush, 10) < 30 * 60 * 1000) {
                console.log("⏱ Пуш уже был недавно, ждём ещё.");
                return;
            }

            localStorage.setItem("lastPushTime", now.toString());

            navigator.serviceWorker.ready.then((registration) => {
                registration.active?.postMessage({
                    type: "CUSTOM_PUSH",
                    payload: {
                        title: "Внимание!",
                        body: `В красном листе ${redTasks.length} задач(а)! Поторопись её выполнить!`,
                    },
                });
            });
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
