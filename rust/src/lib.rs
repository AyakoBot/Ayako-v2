use wasm_bindgen::prelude::*;
use regex::Regex;
use js_sys::Array;

#[wasm_bindgen]
pub fn filtered_content(re_patterns: &Array, content: &str) -> String {
    let mut acc = String::from(content);
    for pattern in re_patterns.iter() {
        if let Some(pattern) = pattern.as_string() {
            match Regex::new(&pattern) {
                Ok(v) => {
                    acc = v.replace_all(&acc, "[...]").into_owned();
                },
                Err(_) => panic!(),
            };
        }
    }
    acc
}