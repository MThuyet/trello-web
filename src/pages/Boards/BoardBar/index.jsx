import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const CHIP_STYLE = {
  color: 'primary.main',
  backgroundColor: 'white',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

const BoardBar = () => {
  return (
    <Box
      sx={{
        paddingX: 2,
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflow: 'auto',
        borderTop: '1px solid #00bfa5'
      }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={CHIP_STYLE} icon={<DashboardIcon />} label="MTHUYET MERN Stack Board" clickable />

        <Chip sx={CHIP_STYLE} icon={<VpnLockIcon />} label="Public/Private Workspace" clickable />

        <Chip sx={CHIP_STYLE} icon={<AddToDriveIcon />} label="Add to Google Drive" clickable />

        <Chip sx={CHIP_STYLE} icon={<BoltIcon />} label="Automation" clickable />

        <Chip sx={CHIP_STYLE} icon={<FilterListIcon />} label="Filters" clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />}>
          Invite
        </Button>
        <AvatarGroup max={7} sx={{ '& .MuiAvatar-root': { width: 34, height: 34, fontSize: 16 } }}>
          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://trungquandev.com/wp-content/uploads/2024/03/white-bg-main-avatar-circle-min-trungquandev-codetq-375.jpeg"
            />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://lavenderstudio.com.vn/wp-content/uploads/2019/10/gia-chup-hinh-chan-dung-ca-nhan-tp-hcm-01.jpg"
            />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar alt="mthuyet</>dev" src="https://studiochupanhdep.com/Upload/Images/Album/chan-dung-beauty-05.jpg" />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar alt="mthuyet</>dev" src="https://mimosawedding.vn/wp-content/uploads/2022/07/cach-chup-anh-chan-dung-9.jpg" />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar alt="mthuyet</>dev" src="https://thanhnien.mediacdn.vn/Uploaded/ngocthanh/2016_03_23/9x01_YGEO.jpg" />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://www.paratime.vn/wp-content/uploads/2019/09/timestudio.vn-headshot-eye-glasses-02.jpg"
            />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCJwd9cmeJAdagmddMZhHGSTc1yzhR7tkjw&s"
            />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar alt="mthuyet</>dev" src="https://thanhnien.mediacdn.vn/Uploaded/ngocthanh/2016_03_23/9x01_YGEO.jpg" />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://www.paratime.vn/wp-content/uploads/2019/09/timestudio.vn-headshot-eye-glasses-02.jpg"
            />
          </Tooltip>

          <Tooltip title="mthuyet</>dev">
            <Avatar
              alt="mthuyet</>dev"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXCJwd9cmeJAdagmddMZhHGSTc1yzhR7tkjw&s"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
