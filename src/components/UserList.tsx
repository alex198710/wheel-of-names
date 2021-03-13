import React, { useState } from "react"
import ClearIcon from "@material-ui/icons/Clear"
import { IconButton, Button, TextField } from "@material-ui/core"

interface Props {
  list: string[]
  addItem: (name: string) => void
  reset: () => void
  deleteItem: (name: string) => void
}

const UserList = ({ list, addItem, reset, deleteItem }: Props) => {
  const [name, setName] = useState("")
  return (
    <div>
      <TextField
        variant="outlined"
        size="small"
        label="Nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      &nbsp; &nbsp;
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          addItem(name)
          setName("")
        }}
      >
        Add
      </Button>
      &nbsp; &nbsp;
      <Button color="primary" variant="contained" onClick={reset}>
        reset
      </Button>
      <br />
      <br />
      <div className="names">
        {list.map((n: any) => (
          <div key={n} className="item">
            {n}
            <IconButton aria-label="delete" onClick={() => deleteItem(n)}>
              <ClearIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  )
}
export default UserList
