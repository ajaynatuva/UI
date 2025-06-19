import swal from 'sweetalert2';
import PropTypes from "prop-types";
import '../CustomSwal/CustomSwal.css';


export const CustomSwal = (icon,text,confirmButtonColor,confirmButtonText,title) => {
  return  swal.fire({
        icon: icon,
        html: text,
        title: title,
        confirmButtonColor: confirmButtonColor,
        confirmButtonText: confirmButtonText,
        allowOutsideClick: false, // Prevent closing by clicking outside
        backdrop: true, // Ensure a backdrop appears behind the popup
        didOpen: () => {
            const sidebars = document.querySelectorAll('.sideNav'); // Select all sidebar elements
            sidebars.forEach(sidebar => {
              sidebar.classList.add('sidebar-disabled'); // Disable all sidebar components
            });
          },
          willClose: () => {
            const sidebars = document.querySelectorAll('.sideNav'); // Select all sidebar elements again
            sidebars.forEach(sidebar => {
              sidebar.classList.remove('sidebar-disabled'); // Re-enable all sidebar components
            });
          }
})
}

