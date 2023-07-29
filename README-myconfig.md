# Notes on my config

## Function Keys

### recommended usage

Mac:

- System preferences > Keyboard > `Use F1, F2, etc as standard function keys`
- Optional: Shortcuts
  - Mission Control:
    - Mission Control: F3
    - Application Windows: F4
    - Show Desktop: F5
  - All Applications - Show Help Menu
  - Keyboard - move focus to next window

Karabiner: leave `Use F1, F2, etc as standard function keys` unchecked

Useful:

```
"to": {
  "key_code": "mission_control"
}

"to": {
  "consumer_key_code": "volume_increment"
}
```

Not all Mac functions are available in karabiner.

## Complex

### File locations

From [File locations | Karabiner-Elements](https://karabiner-elements.pqrs.org/docs/json/location/)

`~/.config/karabiner/assets/complex_modifications`

- Imported complex_modifications files.
- You can use them in Karabiner-Elements Settings > Complex Modifications > Add rule.
