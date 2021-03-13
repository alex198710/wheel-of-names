import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid } from "@material-ui/core"
import WheelOfNames from "./components/WheelOfNames"
import UserList from "./components/UserList"
import UserService from "./services/UserService"
import "./App.css"

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}))

const App = () => {
  const classes = useStyles()
  const [list, setList] = useState(UserService.getUserList()) 
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <WheelOfNames list={list} />
        </Grid>
        <Grid item xs={4}>
          <UserList 
            list={list}
            addItem={(n: string) => {
              UserService.addItem(n)
              setList([...list, n])
            }}
            reset={() => {
              UserService.reset()
              setList(UserService.getUserList())
            }}
            deleteItem={(n: string) => {
              UserService.deleteItem(n)
              setList(list.filter((e: string) => e !== n))
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default App
