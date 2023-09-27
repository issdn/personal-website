import type { TCommand } from ".";
import type { Actions } from "../stores/pixelPainterStore";

interface ICommandInvoker {
    commands: Map<Actions, ReturnType<TCommand>>;
    backgroundCommands: Set<ReturnType<TCommand>>;
}

class CommandInvoker implements ICommandInvoker {
    commands: Map<Actions, ReturnType<TCommand>> = new Map();
    backgroundCommands = new Set<ReturnType<TCommand>>();
}

export default CommandInvoker;
export type { ICommandInvoker }