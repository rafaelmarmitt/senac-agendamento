-- Add check_in_at column to bookings table
ALTER TABLE public.bookings ADD COLUMN check_in_at timestamp with time zone;

-- Add comment to the column
COMMENT ON COLUMN public.bookings.check_in_at IS 'Timestamp when the user performed check-in';