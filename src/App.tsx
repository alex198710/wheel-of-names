import React, { Fragment, useState, useEffect } from "react"
import { animated, useSpring } from "react-spring"
import fireworks from "react-fireworks"
import Modal from "@material-ui/core/Modal"
import { makeStyles } from "@material-ui/core/styles"
import ClearIcon from "@material-ui/icons/Clear"
import { IconButton, Button, TextField, Grid } from "@material-ui/core"
import "./App.css"

var storage = window.localStorage

const DEFAULT = "default_list"

const colors = ["#edb213", "#3369e8", "#009926", "#d51026"] // yellow, blue, green, red
const storedList = storage.getItem(DEFAULT)
const default_list = storedList
  ? JSON.parse(storedList)
  : [
      "Millicent Drummond",
      "Ember Bonilla",
      "Gurdeep Hulme",
      "Scarlett Harrison",
      "Milan Edwards",
      "Aishah Kouma",
      "Arya Spooner",
      "Ella-Louise Bone",
      "Yuvaan Bate",
      "Humayra Adkins",
      "Rogan Costa",
      "Ivy-Rose Montes",
      "Adrian Harrell",
      "Bronte Mcknight",
    ]

const OFFSET = 0

const map = function (
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  if (value === 0) {
    return out_min
  }
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}

function getModalStyle() {
  const top = 50
  const left = 50
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: "absolute",
    width: 400,
    color: "white",
    backgroundColor: "#424242",
    border: "4px solid #000",
    borderRadius: 5,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const calculateCirclePoints = (
  x0: number,
  y0: number,
  r: number,
  nbElements: number,
  index: number
): { x: number; y: number }[] => {
  const t = 360 / nbElements
  const points = []
  for (let i = t * index; i < t * (index + 1); i += 5) {
    points.push(calculatePoint(x0, y0, r, i))
  }
  points.push(calculatePoint(x0, y0, r, t * (index + 1)))
  return points
}

const calculatePoint = (x0: number, y0: number, r: number, i: number) => {
  const x = x0 + r * Math.cos(i * (Math.PI / 180))
  const y = y0 + r * Math.sin(i * (Math.PI / 180))
  return { x, y }
}

const calculateTextPoint = (
  x0: number,
  y0: number,
  r: number,
  nbElements: number,
  index: number
): { x: number; y: number } => {
  const t = 360 / nbElements
  const lastIdx = t * (index + 1)
  const firstIdx = t * index
  return calculatePoint(x0, y0, r, (firstIdx + lastIdx) / 2 + 7) // 7 degrees for text height
}

function App() {
  const cr = 200
  const tr = 50
  const cx = 250
  const cy = 250
  const [list, setList] = useState(default_list)
  const [name, setName] = useState("")
  const [power, setPower] = useState(100)
  const [pressed, setPressed] = useState(false)
  const [winner, setWinner] = useState()
  const [acc, setAcc] = useState(0)
  const config = { mass: 50, tension: 200, friction: 200, precision: 0.001 }
  const [props, set] = useSpring(() => ({
    transform: "rotate(0deg)",
    immediate: false,
  }))
  const addItem = () => {
    storage.setItem(DEFAULT, JSON.stringify([...list, name]))
    setList([...list, name])
    setName("")
  }
  const deleteItem = (n: string) => {
    storage.setItem(
      DEFAULT,
      JSON.stringify(list.filter((e: string) => e !== n))
    )
    setList(list.filter((e: string) => e !== n))
  }
  const reset = () => {
    storage.clear()
    window.location.reload()
  }
  useEffect(() => {
    if (pressed) {
      setTimeout(() => {
        fireworks.init("fireworks", {})
      }, 2500)
      const from = map(acc, 0, 100, 0, 700)
      const to = map(acc + power, 0, 100, 0, 700)
      set({
        from: { transform: `rotate(${from}deg)` },
        transform: `rotate(${to}deg)`,
        immediate: false,
        config,
        onRest: () => {
          fireworks.start()
          setPressed(false)
          const positionAfterAnimation = to % 360
          const personElectedIdx = Math.floor(
            (list.length * positionAfterAnimation) / 360
          )
          const personElected = list[list.length - personElectedIdx - 1]
          setWinner(personElected)
          setTimeout(() => {
            fireworks.stop()
            setTimeout(() => {
              ;(document.querySelector("#fireworks") || ({} as any)).innerHTML =
                ""
            }, 10000)
          }, 5000)
        },
      })
      setAcc(acc + power)
    }
  }, [power, pressed])

  const renderItems = (numOfItems: number) => {
    let items = []
    for (let i = 0; i < numOfItems; i++) {
      const points = calculateCirclePoints(cx, cy, cr, numOfItems, i)
      const polygonPoints = points.reduce(
        (acc, curr) => `${acc} ${curr.x},${curr.y}`,
        `${cx},${cy}`
      )
      const textPoint = calculateTextPoint(cx, cy, tr, numOfItems, i)
      items.push(
        <Fragment key={i}>
          <polygon
            points={polygonPoints}
            style={{ fill: colors[i % 4], stroke: "white", strokeWidth: 2 }}
          />
          <text
            x={textPoint.x}
            y={textPoint.y}
            fill={i % 2 === 1 ? "white" : "black"}
            fontSize="15px"
            transform={`rotate(${((i + 0.5) / numOfItems + OFFSET) * 360} ${textPoint.x},${textPoint.y})`}
          >
            {list[i]}
          </text>
        </Fragment>
      )
    }
    return items
  }
  const start = () => {
    setPower(100 + Math.floor(Math.random() * 100))
    setPressed(true)
  }
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            className={"svg"}
          >
            <g fill="white" stroke="lightgray" strokeWidth="0">
              <circle cx="250" cy="250" r={cr} />
            </g>
            <animated.g
              style={{
                transform: props.transform,
                transformOrigin: "center",
              }}
              className={pressed ? "" : "ready"}
              onClick={start}
            >
              {renderItems(default_list.length)}
            </animated.g>
            <g fill="white" className={pressed ? "" : "ready"} onClick={start}>
              <circle cx="250" cy="250" r="30" />
            </g>
            {/*
            <g fill="transparent" stroke="lightgray" strokeWidth="2">
              <circle
                cx="250"
                cy="250"
                r={cr}
                style={{ clipPath: "circle(204px at 50% 50%" }}
              />
            </g>
            */}
            {!pressed && (
              <>
                <path
                  id="curve"
                  fill="transparent"
                  d="M125,80c4-6.1,60.5-40.8,138.6-38.6c98.3,3.2,180.8,90.3,140.1,90"
                />
                <text width="500">
                  <textPath href="#curve">
                    Cliquer pour lancer la roue {"\u21C0"}
                  </textPath>
                </text>
              </>
            )}
            <g fill="lightgray" stroke="black" strokeWidth="1">
              <polygon points="430,250 470,235 470,265" />
            </g>
          </svg>
        </Grid>
        <Grid item xs={4}>
          <div>
            <TextField
              variant="outlined"
              size="small"
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            &nbsp; &nbsp;
            <Button color="primary" variant="contained" onClick={addItem}>
              Add
            </Button>
            &nbsp; &nbsp;
            <Button color="primary" variant="contained" onClick={reset}>
              reset
            </Button>
            {list.map((n: any) => (
              <div key={n} className="item">
                {n}
                <IconButton aria-label="delete" onClick={() => deleteItem(n)}>
                  <ClearIcon />
                </IconButton>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
      <div id="fireworks" />
      {winner && (
        <Modal
          open={true}
          onClose={() => setWinner(undefined)}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Bravo!!!</h2>
            <p id="simple-modal-description">
              <>{`Félicitations au figeur: ${winner}`}</>
            </p>
            <CustomButton
              name={"Rejouer"}
              onClick={() => {
                fireworks.stop()
                ;(
                  document.querySelector("#fireworks") || ({} as any)
                ).innerHTML = ""
                setWinner(undefined)
              }}
            />
          </div>
        </Modal>
      )}
      {/*<CustomButton name={"Lancer"} onClick={start} />*/}
    </div>
  )
}

const CustomButton = ({ name, onClick }: any) => (
  <button
    className="main"
    onClick={onClick}
    style={{ height: "8vh", fontSize: "22px", backgroundColor: colors[1] }}
  >
    <div className="content">{name}</div>
  </button>
)

export default App
