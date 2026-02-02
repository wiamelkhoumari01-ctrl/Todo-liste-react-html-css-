const e = React.createElement;

function App() {
  const [tasks, setTasks] = React.useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "light"
  );
  const [page, setPage] = React.useState("todo");

  const [text, setText] = React.useState("");
  const [time, setTime] = React.useState("");
  const [day, setDay] = React.useState("J");
  const [editId, setEditId] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  function addOrEditTask() {
    if (!text || !time) return;

    if (editId) {
      setTasks(tasks.map(t =>
        t.id === editId ? { ...t, text, time, day } : t
      ));
      setEditId(null);
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        text,
        time,
        day,
        done: false
      }]);
    }
    setText("");
    setTime("");
  }

  function editTask(task) {
    setText(task.text);
    setTime(task.time);
    setDay(task.day);
    setEditId(task.id);
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function toggleDone(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  function progressPercent() {
    if (tasks.length === 0) return 0;
    return Math.round(
      (tasks.filter(t => t.done).length / tasks.length) * 100
    );
  }

  return e("div", { className: `app ${theme}` },
    e("div", { className: "card" },


      e("div", { className: "header" },
        e("h1", null, " - Discipline "),
        e("div", { className: "nav" },
          e("button", { onClick: () => setPage("todo") }, " Todo"),
          e("button", { onClick: () => setPage("progress") }, " Progress"),
          e("button", {
            onClick: () => setTheme(theme === "light" ? "dark" : "light")
          }, theme === "light" ? "🌙" : "☀️")
        )
      ),

      page === "todo" && e(React.Fragment, null,

        e("div", { className: "inputs" },
          e("input", {
            placeholder: "Task...",
            value: text,
            onChange: ev => setText(ev.target.value)
          }),
          e("input", {
            type: "time",
            value: time,
            onChange: ev => setTime(ev.target.value)
          }),
          e("input", {
            type:"date",
            value: day,
            onChange: ev => setDay(ev.target.value)
          }),
          e("button", { onClick: addOrEditTask },
            editId ? "✔️" : "＋"
          )
        ),

        e("table", null,
          e("thead", null,
            e("tr", null,
              e("th", null, "Day"),
              e("th", null, "Task"),
              e("th", null, "Time"),
              e("th", null, "Done"),
              e("th", null, "Actions")
            )
          ),
          e("tbody", null,
            tasks.map(task =>
              e("tr", {
                key: task.id,
                className: task.done ? "done" : ""
              },
                e("td", null, task.day),
                e("td", null, task.text),
                e("td", null, task.time),
                e("td", null,
                  e("input", {
                    type: "checkbox",
                    checked: task.done,
                    onChange: () => toggleDone(task.id)
                  })
                ),
                e("td", { className: "actions" },
                  e("button", { onClick: () => editTask(task) }, "✏️"),
                  e("button", { onClick: () => deleteTask(task.id) }, "🗑️")
                )
              )
            )
          )
        )
      ),


      page === "progress" && e("div", { className: "progress-box" },
        e("div", {
          className: "circle",
          style: { "--percent": progressPercent() + "%" }
        }, progressPercent() + "%")
      )
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(e(App));
