const NotificationIcon = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      {/* Parte superior: gris con opacidad */}
      <path
        fill="currentColor"
        fillOpacity=".3"
        d="M6 8a6 6 0 1 1 12 0v1.83a7.83 7.83 0 0 0 1.116 4.03l.553.922c.367.612.551.918.564 1.168a1 1 0 0 1-.529.932c-.22.118-.577.118-1.29.118H5.586c-.713 0-1.07 0-1.29-.118a1 1 0 0 1-.529-.932c.013-.25.197-.556.564-1.168l.553-.922A7.83 7.83 0 0 0 6 9.83V8Z"
      />
      {/* Parte inferior: blanca */}
      <path
        fill="white"
        d="M14.35 18a.14.14 0 0 1 .143.15c-.045.475-.3.925-.725 1.264-.47.375-1.105.586-1.768.586s-1.299-.21-1.768-.586c-.424-.34-.68-.789-.725-1.264A.14.14 0 0 1 9.65 18h4.7Z"
      />
    </svg>
  );
  
  export default NotificationIcon;
  