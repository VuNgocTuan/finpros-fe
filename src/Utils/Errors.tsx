import Router from "next/router";

export function redirectPage(location: string) {
    Router.push(location);
}