export let log = console;
export function getLogger(name) {
    return log;
}
export function setLogger(logger) {
    log = logger;
}
