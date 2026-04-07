import argparse
import os
import shutil
import subprocess
from common import node_path, resolve_repo_root
from react_runner import get_actions as get_react_actions
from react_runner import react_run_action
from vue_runner import get_actions as get_vue_actions
from vue_runner import vue_run_action


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("tech", choices=["react", "vue"])
    return parser.parse_args()


def resolve_cli_cmd(repo_root):
    cli_entry = os.path.join(repo_root, "bin", "index.mjs")
    return [node_path(), cli_entry]


def print_cli_version(repo_root):
    cli_entry = resolve_cli_cmd(repo_root)
    subprocess.run(cli_entry + ["-v"], check=True)


def run_cli(tech, repo_root, workdir):
    actions = get_react_actions() if tech == "react" else get_vue_actions()
    cli_entry = resolve_cli_cmd(repo_root)
    if tech == "react":
        react_run_action(actions, cli_entry, workdir)
    else:
        vue_run_action(actions, cli_entry, workdir)

def main():
    args = parse_args()
    repo_root = resolve_repo_root()
    print_cli_version(repo_root)

    app_root = os.path.join(repo_root, "test", "auto", "app")
    print(f"[auto] Cleaning app root: {app_root}")
    shutil.rmtree(app_root, ignore_errors=True)
    os.makedirs(app_root, exist_ok=True)

    workdir = os.path.join(app_root, args.tech)
    os.makedirs(workdir, exist_ok=True)

    run_cli(args.tech, repo_root, workdir)


if __name__ == "__main__":
    main()
