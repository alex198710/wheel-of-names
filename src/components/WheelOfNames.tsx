import React, { Fragment, useState, useEffect } from "react"
import { animated, useSpring } from "react-spring"
import fireworks from "react-fireworks"
import Modal from "@material-ui/core/Modal"
import { makeStyles } from "@material-ui/core/styles"
import CustomButton from "./CustomButton"
import CircleUtil from "../utils/CircleUtil"
import "./WheelOfNames.css"

const config = { mass: 50, tension: 200, friction: 200, precision: 0.001 }
const colors = ["#edb213", "#3369e8", "#009926", "#d51026"] // yellow, blue, green, red

const findPersonElected = (list: string[], to: number): string => {
  const positionAfterAnimation = to % 360
  const personElectedIdx = Math.floor(
    (list.length * positionAfterAnimation) / 360
  )
  return list[list.length - personElectedIdx - 1]
}
const getModalStyle = () => {
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

interface Props {
  list: string[]
}

const WheelOfNames = ({ list }: Props) => {
  const cr = 200
  const tr = 50
  const cx = 250
  const cy = 250
  const [power, setPower] = useState(100)
  const [pressed, setPressed] = useState(false)
  const [winner, setWinner] = useState<string>()
  const [acc, setAcc] = useState(0)
  const [props, set] = useSpring(() => ({
    transform: "rotate(0deg)",
    immediate: false,
  }))
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)

  const start = () => {
    setPower(100 + Math.floor(Math.random() * 100))
    setPressed(true)
  }

  useEffect(() => {
    if (pressed) {
      setTimeout(() => {
        fireworks.init("fireworks", {})
      }, 2500)
      const from = CircleUtil.map(acc, 0, 100, 0, 700)
      const to = CircleUtil.map(acc + power, 0, 100, 0, 700)
      set({
        from: { transform: `rotate(${from}deg)` },
        transform: `rotate(${to}deg)`,
        immediate: false,
        config,
        onRest: () => {
          fireworks.start()
          setPressed(false)
          setAcc(acc + power)
          setWinner(findPersonElected(list, to))
          setTimeout(() => {
            fireworks.stop()
            setTimeout(() => {
              ;(document.querySelector("#fireworks") as any).innerHTML = ""
            }, 10000)
          }, 5000)
        },
      })
    }
  }, [acc, pressed, power, list, set])

  const renderItems = (numOfItems: number) => {
    let items = []
    for (let i = 0; i < numOfItems; i++) {
      const polygonPoints = CircleUtil.calculateCirclePoints(
        cx,
        cy,
        cr,
        numOfItems,
        i
      )
      const textPoint = CircleUtil.calculateTextPoint(cx, cy, tr, numOfItems, i)
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
            transform={`rotate(${((i + 0.5) / numOfItems) * 360} ${
              textPoint.x
            },${textPoint.y})`}
          >
            {list[i]}
          </text>
        </Fragment>
      )
    }
    return items
  }

  const renderModal = () => (
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
          color={colors[1]}
          onClick={() => {
            fireworks.stop()
            ;(document.querySelector("#fireworks") || ({} as any)).innerHTML =
              ""
            setWinner(undefined)
          }}
        />
      </div>
    </Modal>
  )

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        className="svg"
      >
        <g fill="white">
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
          {renderItems(list.length)}
        </animated.g>
        <g fill="white" className={pressed ? "" : "ready"} onClick={start}>
          <circle cx="250" cy="250" r="30" />
        </g>
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
      <div id="fireworks" />
      {winner && renderModal()}
    </>
  )
}

export default WheelOfNames
