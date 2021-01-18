import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./StatsTile.css";
import { prettifyStatistic } from "./util";

function StatsTile({
  category,
  isActive,
  isRed,
  isOrange,
  isGreen,
  title,
  perMillion,
  total,
  ...props
}) {
  return (
    <Card
      style={
        isActive
          ? { backgroundColor: "rgb(221, 214, 214)" }
          : { backgroundColor: "white" }
      }
      onClick={props.onClick}
      className={`statsTile ${isActive && "statsTile--selected"} ${
        isOrange && "statsTile--orange"
      } ${isGreen && "statsTile--green"} ${isRed && "statsTile--red"}`}
    >
      <CardContent>
        <Typography className="statsTile__title" color="textPrimary">
          {title}
        </Typography>
        <h3
          className={`statsTile__cases ${
            isGreen && "statsTile__cases--green"
          } ${isRed && "statsTile__cases--red"} ${
            isOrange && "statsTile__cases--orange"
          }`}
        >
          {prettifyStatistic(perMillion)} per million
        </h3>
        <Typography className="statsTile__total" color="textSecondary">
          {prettifyStatistic(total)} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default StatsTile;
