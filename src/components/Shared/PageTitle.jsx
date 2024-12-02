import { PropTypes } from "prop-types";

const PageTitle = ({ heading, subHeading }) => {
  return (
    <div className="py-2 text-center">
      <h2 className="text-2xl font-semibold lg:text-5xl mb-2 capitalize underline underline-offset-8">
        {heading}
      </h2>
      <p className="text-xl font-light my-3 w-4/5 md:w-1/2 mx-auto">{subHeading}</p>
    </div>
  );
};

PageTitle.propTypes = {
  heading: PropTypes.string,
  subHeading: PropTypes.string,
};

export default PageTitle;
