import os
import pexpect
import subprocess
import sys

NPM_LOCAL = ["npm", "--ignore-workspace"]

KEYBOARD = {
    "ArrowDown": "\x1b[B",
    "ArrowDownAlt": "\x1bOB",
    "ArrowUp": "\x1b[A",
    "ArrowUpAlt": "\x1bOA",
    "Enter": "\r",
    "EnterLF": "\n",
    "Space": "\x20",
}


def get_actions():
    return [
        {
            "project_name": "next-app-tailwind",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
            "css": KEYBOARD["Enter"],
        },
        {
            "project_name": "next-app-vanilla-extract",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
            "css": KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
        },
        {
            "project_name": "next-pages-tailwind",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["ArrowDown"] + KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
            "css": KEYBOARD["Enter"],
        },
        {
            "project_name": "next-pages-vanilla-extract",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["ArrowDown"] + KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
            "css": KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],    
        },
        {
            "project_name": "tanstack-router-tailwind",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["Enter"],
            "css": KEYBOARD["Enter"],
          },
        {
            "project_name": "tanstack-router-vanilla-extract",
            "tech_stack": KEYBOARD["Enter"],
            "framework": KEYBOARD["Enter"],
            "css": KEYBOARD["ArrowDown"] + KEYBOARD["Enter"],
        },
    ]


def react_run_action(actions, cmd_noninteractive, workdir):
    for action in actions:
        env = os.environ.copy()
        env["CLI_TEST"] = "1"
        env["TERM"] = env.get("TERM", "xterm-256color")

        child = pexpect.spawn(cmd_noninteractive[0], cmd_noninteractive[1:], cwd=workdir, env=env, encoding="utf-8")
        child.logfile = sys.stdout
        try:
            child.expect(r"What is your project named")
            child.sendline(action["project_name"]+KEYBOARD["Enter"])

            child.expect(r"Select a tech stack for your project")
            child.sendline(action["tech_stack"])

            child.expect(r"Select\s+a\s+.?framework.?for your project")
            child.sendline(action["framework"])

            child.expect(r"elect a CSS framework for your project")
            child.sendline(action["css"])

            child.expect(pexpect.EOF, timeout=120)
            child.close()

            if child.exitstatus != 0:
                raise RuntimeError(
                    f"CLI failed for {action['project_name']} with exit code {child.exitstatus}"
                )

            if child.signalstatus is not None:
                raise RuntimeError(
                    f"CLI terminated by signal {child.signalstatus} for {action['project_name']}"
                )

            print("[PTY SAMPLE] Non-interactive run finished successfully")
            project_dir = os.path.join(workdir, action["project_name"])

            if not os.path.isdir(project_dir):
                raise FileNotFoundError(
                    f"Project directory was not created: {project_dir}"
                )

            print(f"[PTY SAMPLE] Running npm in {project_dir}")
            print(f"[PTY SAMPLE] Installing dependencies in {project_dir}")
            subprocess.run(NPM_LOCAL + ["install"], cwd=project_dir, check=True)
            subprocess.run(NPM_LOCAL + ["test"], cwd=project_dir, check=True)
            subprocess.run(NPM_LOCAL + ["run","build"], cwd=project_dir, check=True)
        except Exception:
            try:
                child.close()
            except Exception:
                pass
            raise
    
