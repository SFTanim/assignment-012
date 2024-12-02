import PropTypes from "prop-types";

const SectionTItle = ({ heading, subHeading }) => {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold lg:text-5xl mb-2 capitalize">
        {heading}
      </h2>
      <p className="text-xl font-light mb-6">{subHeading}</p>
    </div>
  );
};

SectionTItle.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
};

export default SectionTItle;
