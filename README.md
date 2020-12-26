## Recoil・カスタムフックを使ってリアルタイムチャット

https://recoil-chat.netlify.app/

## 使用ライブラリ周り

- Netlify(ホスティング)
- FireBase Realtime Database
- Firebase Authentication
- TypeScript
- React
- Recoil
- BootStrap4

## Realtime Database Rule

```json
{
  "rules": {
    ".write": false,
    "connections": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth.uid === $uid"
      }
    },
    "boards": {
      ".read": "auth != null",
      ".write": "auth.uid != null",
      ".indexOn": ["uid", "createdAt"],
      "$bid": {
        ".validate": "newData.hasChildren(['uid', 'message', 'createdAt', 'updatedAt'])",
        "uid": {
          ".validate": "newData.isString() && newData.val() === auth.uid"
        },
        "message": {
          ".validate": "newData.isString() && 0 < newData.val().length && newData.val().length <= 150"
        },
        "createdAt": {
          ".validate": "newData.isNumber()"
        },
        "updatedAt": {
          ".validate": "newData.isNumber()"
        },
        "$other": { ".validate": false }
      }
    }
  }
}
```

## モックソースコード

https://github.com/cha711/cha711.github.io

## モックプレビュー

https://cha711.github.io
