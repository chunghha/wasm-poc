# WASM POC

Build the wasm module,
```
❯ cd rwasm
❯ wasm-pack build
```

To run the app locally,
```
❯ deno run --allow-net --allow-read app.ts  
```

From another terminal.
```
❯ curl --request POST --url http://localhost:8000/api --header 'content-type: application/json' --data '{
        "type": "rust",
        "rounds": 46340
}'
```

### Credits
[Turbo Boost Deno With Rust in 4 Steps](https://www.youtube.com/watch?v=YA4VC0UO0Ms)