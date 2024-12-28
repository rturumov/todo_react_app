import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    summary: "",
    state: "Not done",
    deadline: "",
  });
  const [filterState, setFilterState] = useState("");
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value  (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  function createTask() {
    if (!taskForm.title) return alert("Title is required");
    const newTasks = [...tasks, { ...taskForm }];
    setTasks(newTasks);
    saveTasks(newTasks);
    setTaskForm({ title: "", summary: "", state: "Not done", deadline: "" });
  }

  function deleteTask(index) {
    const updatedTasks = tasks.slice();
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function saveTasks(updatedTasks) {
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function sortTasksByState(state) {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.state === state && b.state !== state) return -1;
      if (a.state !== state && b.state === state) return 1;
      return 0;
    });
    setTasks(sortedTasks);
  }

  const filteredTasks = filterState
    ? tasks.filter((task) => task.state === filterState)
    : tasks;

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            centered
          >
            <TextInput
              mt={"md"}
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              mt={"md"}
              value={taskForm.summary}
              onChange={(e) =>
                setTaskForm({ ...taskForm, summary: e.target.value })
              }
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Select
              mt={"md"}
              label={"State"}
              data={["Done", "Not done", "Doing right now"]}
              value={taskForm.state}
              onChange={(value) => setTaskForm({ ...taskForm, state: value })}
            />
            <TextInput
              mt={"md"}
              type="date"
              value={taskForm.deadline}
              onChange={(e) =>
                setTaskForm({ ...taskForm, deadline: e.target.value })
              }
              label={"Deadline"}
            />
            <Group mt={"md"} position={"apart"}>
              <Button onClick={() => setOpened(false)} variant={"subtle"}>
                Cancel
              </Button>
              <Button onClick={createTask}>Create Task</Button>
            </Group>
          </Modal>

          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>

            <Group mt="md">
              <Button onClick={() => sortTasksByState("Done")}>Show 'Done" First</Button>
              <Button onClick={() => sortTasksByState("Doing right now")}>
                Show "Doing" First
              </Button>
              <Button onClick={() => sortTasksByState("Not done")}>Show "Not Done" First</Button>
            </Group>

            <Select
              mt="md"
              label="Filter Tasks"
              data={[
                { value: "", label: "All" },
                { value: "Done", label: "Done" },
                { value: "Not done", label: "Not done" },
                { value: "Doing right now", label: "Doing right now" },
              ]}
              value={filterState}
              onChange={(value) => setFilterState(value)}
            />

            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <Card withBorder key={index} mt={"sm"}>
                  <Group position={"apart"}>
                    <Text weight={"bold"}>{task.title}</Text>
                    <Group>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text color={"dimmed"} size={"md"} mt={"sm"}>
                    {task.summary || "No summary was provided for this task"}
                  </Text>
                  <Text color={"dimmed"} size={"sm"} mt={"sm"}>
                    State: {task.state}
                  </Text>
                  <Text color={"dimmed"} size={"sm"} mt={"sm"}>
                    Deadline: {task.deadline || "No deadline"}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                You have no tasks
              </Text>
            )}

            <Button onClick={() => setOpened(true)} fullWidth mt={"md"}>
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}