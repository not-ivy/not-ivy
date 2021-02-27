### Hello!

```rust
struct sourTaste000;

trait Code {
    fn code(&self, lang: Languages);
}

impl Code for sourTaste000 {
    fn code(&self, lang: Languages) {
            println!("I code in {:?}!", lang)
    }
}

#[derive(std::fmt::Debug)]
enum Languages {
    Rust,
    Java,
    Kotlin,
    JavaScript,
    Python,
    Shell
}

fn main() {
    assert!(cfg!(unix))
}
```