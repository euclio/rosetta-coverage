#![feature(custom_derive, plugin)]
#![plugin(serde_macros)]

#[macro_use]
extern crate log;

extern crate env_logger;
extern crate firebase;
extern crate coverage;
extern crate serde;
extern crate serde_json;

use firebase::Firebase;

fn main() {
    env_logger::init().unwrap();

    let tasks = coverage::fetch_all_tasks()
                    .inspect(|task| {
                        info!(r#"read "{}""#, &task.title);
                        debug!("{:?}", &task);
                    })
                    .collect::<Vec<_>>();

    let task_json = serde_json::to_string(&tasks).unwrap();

    let firebase = Firebase::authed("https://rosetta-coverage.firebaseio.com",
                                    env!("FIREBASE_TOKEN"))
                       .unwrap();
    firebase.at("/tasks").unwrap().set(&task_json.to_string()).unwrap();
}
