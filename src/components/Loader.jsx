const Loader = ({ size = "50px", color = "#000" }) => {
    return (
      <div className="flex justify-center items-center">
        <div
          style={{
            width: size,
            height: size,
            border: `3px solid ${color}`,
            borderTop: `5px solid transparent`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  };
  
  export default Loader;