## Recoil・カスタムフックを使ってリアルタイムチャット

https://recoil-chat.netlify.app/

## 使用ライブラリ周り

- Netlify(ホスティング)
- FireBase Realtime Database
- Firebase Authentication
- FireBase Storage
- TypeScript
- React
- Recoil
- BootStrap4

## FireBase Storage Rule

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{fileName} {
      allow read: if true;
      allow write: if resource == null &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

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
        ".validate": "newData.hasChildren(['uid', 'uname','image', 'message','createdAt', 'updatedAt'])",
        "uid": {
          ".validate": "newData.isString() && newData.val() === auth.uid"
        },
        "uname": {
          ".validate": "newData.isString() && 0 < newData.val().length && newData.val().length <= 15"
        },
        "message": {
          ".validate": "newData.isString() && 0 < newData.val().length && newData.val().length <= 150"
        },
        "image": {
          ".validate": "newData.isBoolean()"
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
