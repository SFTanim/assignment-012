import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAuth from "../../../components/hooks/useAuth";
import { PropTypes } from "prop-types";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../components/hooks/useAxiosSecure";

const CheckOutForm = ({ givenDonation, donation, refetch, greaterValue }) => {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const navigate = useNavigate();

  const { errors, data: paymentIntentRes } = useQuery({
    queryKey: [" datas"],
    queryFn: async () => {
      const res = await axiosSecure.post("/create-payment-intent", {
        price: givenDonation,
      });
      setClientSecret(res?.data?.clientSecret);
      return res?.data?.clientSecret;
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (errors) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error in create-payment-intent!",
      });
    }

    if (!paymentIntentRes) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error in create-payment-intent!",
      });
    }

    if (!stripe || !elements || !clientSecret) {
      return setError("Enter Your refund value");
    }

    const card = elements.getElement(CardElement);
    if (card === null) {
      return;
    }

    // Cards Data
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      setError(error?.message);
    } else {
      setError("");
      setTransactionId("");
      console.log("Payment Method:", paymentMethod);
    }

    // Make payment
    const { paymentIntent, error: confirmationError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonyomous",
            name: user?.displayName || "anonyomous",
          },
        },
      });
    if (confirmationError) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: confirmationError?.message,
      });
    } else {
      if (paymentIntent.status === "succeeded") {
        const originalDonatedMoney = paymentIntent.amount / 100;
        const newAmount = donation.donatedMoney + originalDonatedMoney;
        const donatedUser = {
          email: user?.email,
          name: user?.displayName,
          amount: originalDonatedMoney,
          paymentIntentId: paymentIntent?.id,
        };
        axiosSecure.post(`/donations/${donation?._id}`, {
          donatedUser,
          newAmount,
        });
        setTransactionId(paymentIntent?.id);
        const modal = document.getElementById("my_modal_3");
        modal.close();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Payment Successful",
          showConfirmButton: false,
          timer: 1500,
        });
        refetch();
        navigate("/blogs");
      } else {
        const modal = document.getElementById("my_modal_3");
        modal.close();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please try again!",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      {error && <p className="text-red-600 mt-3">*{error}</p>}
      {transactionId && (
        <p className="text-green-700 mt-3">Transaction ID: {transactionId}</p>
      )}
      {!greaterValue && (
        <button
          className="commonly-used-button3 text-center mt-5 w-full"
          type="submit"
        >
          Pay
        </button>
      )}
    </form>
  );
};

CheckOutForm.propTypes = {
  givenDonation: PropTypes.number,
  donation: PropTypes.object,
  greaterValue: PropTypes.bool,
  refetch: PropTypes.func,
};

export default CheckOutForm;
