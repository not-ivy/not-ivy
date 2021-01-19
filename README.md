### Hello!

```rust
struct sourTaste000();

trait Code {
    fn code(&self, lang: Languages);
}

impl Code for sourTaste000 {
    fn code(&self, lang: Languages) {
            println!("I code in {}!", lang.value())
    }
}

enum Languages {
    Rust,
    Java,
    Kotlin,
    JavaScript,
    Python
}

impl Languages {
    fn value(&self) -> &str {
        match *self {
            Languages::Rust => "rust",
            Languages::Java => "java",
            Languages::Kotlin => "kotlin",
            Languages::JavaScript => "JavaScript",
            Languages::Python => "Python"
        }
    }
}
```
___
### Stats
![wakatime stats](https://github-readme-stats.vercel.app/api/wakatime?username=sourTaste000)  
![either your browser broke or github broke](https://github-readme-stats.vercel.app/api?username=sourTaste000&theme=vue&count_private=true&include_all_commits=true)
