import { Skeleton} from "@mui/material"


function DatatableLoader() {
    return (
        <>
           {[1, 2].map(val => <Skeleton key={val} variant="rounded" sx={{ width: { xl: '1100', md: '550', sm: '200' }, marginBottom: '5px' }} height={60} />)}
        </>
    )
}

export default DatatableLoader
