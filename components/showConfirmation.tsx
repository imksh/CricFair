import { View, Text } from 'react-native'
import React from 'react'
import ConfirmationToast from "./ConfirmationToast";
import { Portal } from "react-native-paper";

export default function showConfirmation({func,message,show}) {
  return (
    <Portal>
          <ConfirmationToast
            name={"Delete"}
            fun={() => onDelete(item)}
            message={
              "This wil delete the input permanently. This action cannot be undone. "
            }
            setShow={show}
          />
      </Portal>
  )
}