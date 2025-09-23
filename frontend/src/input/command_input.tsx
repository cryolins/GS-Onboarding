import React, { useState, useEffect } from "react";
import { CommandResponse, MainCommandResponse, MainCommandListResponse } from "../data/response"
import "./command_input.css"
import { createCommand, getMainCommands } from "./input_api";

interface CommandInputProp {
  setCommands: React.Dispatch<React.SetStateAction<CommandResponse[]>>
}

const CommandInput = ({ setCommands }: CommandInputProp) => {
  const [selectedCommand, setSelectedCommand] = useState<MainCommandResponse | null>(null);
  const [parameters, setParameters] = useState<{ [key: string]: string }>({});
  // TODO: (Member) Setup anymore states if necessary
  const [mainCommands, setMainCommands] = useState<MainCommandListResponse | null>(null);

  // TODO: (Member) Fetch MainCommands in a useEffect
  useEffect(
    () => {
      const fetchMainCommands = async () => {
        const fetchedMainCommands = await getMainCommands();
        console.log("fetched mainCommands");
        setMainCommands(fetchedMainCommands);
      }
      fetchMainCommands();
    },
    []
  )

  const handleParameterChange = (param: string, value: string): void => {
    setParameters((prev) => ({
      ...prev,
      [param]: value,
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    // TODO:(Member) Submit to your post endpoint 
    e.preventDefault();
    if(selectedCommand != null){
      createCommand({command_type: selectedCommand.id, params: selectedCommand.params})
    }
    else{
      console.error("command was not selected");
    } 
  }

  const handleSelect = (id: number) => { 
    if(mainCommands != null){
      const foundCommand = mainCommands.data.find((comm) => comm.id == id);
      if(foundCommand != undefined){
        setSelectedCommand(foundCommand);
      }
      else{
        console.error("specified command not found");
        setSelectedCommand(null);
      }
    }
    else{
      console.error("mainCommands not found (is null)");
    }
    
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="spreader">
          <div>
            <label>Command Type: </label>
            <select onChange={(e) => handleSelect(Number(e.target.value))}
            value={selectedCommand?.id}
            >{/* TODO: (Member) Display the list of commands based on the get commands request.
                        It should update the `selectedCommand` field when selecting one.*/}
              {mainCommands?.data.map((mainCommand) => (
                  <option value={mainCommand.id} key={mainCommand.id}>{
                    `${mainCommand.name}: ${mainCommand.format}`
                  }</option>
                ))}
            </select>
          </div>
          {selectedCommand?.params?.split(",").map((param) => (
            <div key={param}>
              <label htmlFor={`param-${param}`}>{param}: </label>
              <input
                id={`param-${param}`}
                type="text"
                value={parameters[param] || ""}
                onChange={(e) => handleParameterChange(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
          <button type="submit">Submit</button>
        </div>
      </form>
    </>
  )
}

export default CommandInput;
