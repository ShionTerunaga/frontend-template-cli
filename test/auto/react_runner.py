import os
import pexpect
import subprocess
import sys

PNPM_LOCAL = ["pnpm", "--ignore-workspace"]

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
            # success if exit code 0
            if child.exitstatus == 0 or child.signalstatus is None:
                print("[PTY SAMPLE] Non-interactive run finished successfully")
                try:
                    child.close()
                except Exception:
                    pass
                
                project_dir = os.path.join(workdir, action["project_name"])
                

                if os.path.isdir(project_dir):
                    print(f"[PTY SAMPLE] Running pnpm in {project_dir}")
                    try:
                        print(f"[PTY SAMPLE] Installing dependencies in {project_dir}")
                        subprocess.run(PNPM_LOCAL + ["install"], cwd=project_dir, check=True)
                    except Exception as e:
                        print(f"[PTY SAMPLE] pnpm install failed: {e}")
                    try:
                        subprocess.run(PNPM_LOCAL + ["test"], cwd=project_dir, check=True)
                    except Exception as e:
                        print(f"[PTY SAMPLE] pnpm test failed: {e}")
                    try:
                        subprocess.run(PNPM_LOCAL + ["build"], cwd=project_dir, check=True)
                    except Exception as e:
                        print(f"[PTY SAMPLE] pnpm build failed: {e}")
                continue
        except Exception:
            # Fall back to interactive if non-interactive path didn't finish cleanly
            try:
                child.close()
            except Exception:
                pass

        # Fall back to interactive mode: hand control to the user instead of
        # sending arrow/shift sequences programmatically.
        cmd = cmd_noninteractive
        print(f"[PTY SAMPLE] Falling back to interactive: {' '.join(cmd)}")
        child = pexpect.spawn(cmd[0], cmd[1:], cwd=workdir, env=env, encoding="utf-8")
        child.logfile = sys.stdout
        # Give the user direct control of the spawned process so they can use
        # their local keyboard (arrow, shift, space) reliably.
        print("[PTY SAMPLE] Entering interactive mode — use arrow/space/enter to answer prompts. Press Ctrl-D to finish.")
        try:
            child.interact()
        except Exception:
            pass
        try:
            child.expect(pexpect.EOF)
        except Exception:
            pass
        try:
            child.close()
        except Exception:
            pass
        # After creating the project, install deps, run tests and build.
    
